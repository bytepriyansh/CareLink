import  { useState, useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Circle,  Text, Group } from 'react-konva';
import { HealthAssistant } from '../lib/gemini';

const PAIN_TYPES = [
    { symbol: '🔥', name: 'Burning', color: '#FF6B6B', darkColor: '#FF3D3D' },
    { symbol: '⚡', name: 'Sharp', color: '#FFD166', darkColor: '#FFB700' },
    { symbol: '💢', name: 'Pressure', color: '#4ECDC4', darkColor: '#00B4A3' },
    { symbol: '🌀', name: 'Throbbing', color: '#845EC2', darkColor: '#6C3EB8' },
    { symbol: '🔨', name: 'Dull', color: '#A5A5A5', darkColor: '#7D7D7D' },
    { symbol: '🧊', name: 'Numbness', color: '#A0E7E5', darkColor: '#5CD6D3' },
];

const BODY_PARTS = [
    'Head', 'Neck', 'Left Shoulder', 'Right Shoulder', 'Chest', 'Upper Abdomen',
    'Lower Abdomen', 'Upper Back', 'Lower Back', 'Left Arm', 'Right Arm',
    'Left Hand', 'Right Hand', 'Left Leg', 'Right Leg', 'Left Foot', 'Right Foot'
];

const BODY_OUTLINE = [
    { x: 150, y: 20, width: 100, height: 120, radius: 50 }, 
    { x: 175, y: 140, width: 50, height: 30 }, 
    { x: 125, y: 170, width: 150, height: 200 }, 
    { x: 80, y: 180, width: 45, height: 150 }, 
    { x: 275, y: 180, width: 45, height: 150 },
    { x: 140, y: 370, width: 40, height: 150 }, 
    { x: 220, y: 370, width: 40, height: 150 }, 
];

const Sketch = () => {
    const [painPoints, setPainPoints] = useState<Array<{
        x: number;
        y: number;
        type: typeof PAIN_TYPES[number];
        intensity: number;
        id: string;
    }>>([]);

    const [selectedPainType, setSelectedPainType] = useState(PAIN_TYPES[0]);
    const [intensity, setIntensity] = useState(5);
    const [selectedBodyPart, setSelectedBodyPart] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [aiResponse, setAiResponse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [darkMode] = useState(false);
    const [showContextForm, setShowContextForm] = useState(false);
    const [context, setContext] = useState({
        age: '',
        gender: '',
        knownConditions: '',
        medications: '',
        allergies: ''
    });

    const stageRef = useRef<Konva.Stage>(null);
    const healthAssistant = new HealthAssistant();

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!selectedBodyPart) return;
        const stage = e.target.getStage();
        const pointerPosition = stage?.getPointerPosition();
        if (!pointerPosition) return;

        const newPainPoint = {
            x: pointerPosition.x,
            y: pointerPosition.y,
            type: selectedPainType,
            intensity,
            id: Math.random().toString(36).substring(7),
        };

        setPainPoints([...painPoints, newPainPoint]);
    };

    const removePainPoint = (id: string) => {
        setPainPoints(painPoints.filter(point => point.id !== id));
    };

    const analyzePain = async () => {
        if (!selectedBodyPart || painPoints.length === 0) {
            alert('Please select a body part and mark at least one pain point');
            return;
        }

        setIsLoading(true);
        setAiResponse(null);

        try {
            if (context.age || context.gender) {
                await healthAssistant.initializeContext({
                    age: parseInt(context.age) || undefined,
                    gender: context.gender || undefined,
                    knownConditions: context.knownConditions ? context.knownConditions.split(',') : undefined,
                    medications: context.medications ? context.medications.split(',') : undefined,
                    allergies: context.allergies ? context.allergies.split(',') : undefined
                });
            }

            const sketchData = {
                bodyPart: selectedBodyPart,
                painLocations: painPoints.map(p => ({
                    x: p.x,
                    y: p.y,
                    type: p.type.name,
                    intensity: p.intensity
                })),
                additionalNotes
            };

            const response = await healthAssistant.assessPainSketch(sketchData);
            setAiResponse(response);
        } catch (error) {
            console.error('Error analyzing pain:', error);
            setAiResponse({
                response: "Sorry, we encountered an error processing your request. Please try again.",
                severity: 'low',
                recommendations: ['Try again later', 'Contact a healthcare provider if symptoms persist'],
                followUpQuestions: [],
                emergency: false
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clearAll = () => {
        setPainPoints([]);
        setSelectedBodyPart('');
        setAiResponse(null);
        setAdditionalNotes('');
    };

    const theme = {
        bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
        cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
        text: darkMode ? 'text-gray-100' : 'text-gray-800',
        secondaryText: darkMode ? 'text-gray-300' : 'text-gray-600',
        primary: darkMode ? 'bg-indigo-600' : 'bg-indigo-500',
        primaryHover: darkMode ? 'hover:bg-indigo-700' : 'hover:bg-indigo-600',
        border: darkMode ? 'border-gray-700' : 'border-gray-200',
        inputBg: darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800',
        canvasBg: darkMode ? '#1F2937' : '#F8FAFC'
    };

    return (
        <div className={`min-h-screen mt-9 ${theme.bg} ${theme.text} transition-colors duration-300`}>
         

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className={`rounded-2xl overflow-hidden shadow-xl ${theme.cardBg}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        <div className={`p-6 border-r ${theme.border}`}>
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className={`mr-2 p-2 rounded-lg ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>🖐️</span>
                                        Select Body Area
                                    </h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        {BODY_PARTS.map(part => (
                                            <button
                                                key={part}
                                                onClick={() => setSelectedBodyPart(part)}
                                                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${selectedBodyPart === part
                                                        ? `${theme.primary} text-white shadow-md transform scale-[1.02]`
                                                        : `${theme.cardBg} ${theme.border} border hover:shadow-md`
                                                    }`}
                                            >
                                                {part}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className={`mr-2 p-2 rounded-lg ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>🎨</span>
                                        Select Pain Type
                                    </h2>
                                    <div className="grid grid-cols-3 gap-3">
                                        {PAIN_TYPES.map(type => (
                                            <button
                                                key={type.symbol}
                                                onClick={() => setSelectedPainType(type)}
                                                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${selectedPainType.symbol === type.symbol
                                                        ? 'ring-2 ring-offset-2 ring-indigo-400 shadow-lg'
                                                        : 'hover:shadow-md'
                                                    }`}
                                                style={{ backgroundColor: darkMode ? type.darkColor : type.color }}
                                            >
                                                <span className="text-2xl">{type.symbol}</span>
                                                <span className="text-xs mt-1 font-medium" style={{ color: darkMode ? 'white' : 'black' }}>
                                                    {type.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className={`mr-2 p-2 rounded-lg ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>📊</span>
                                        Pain Intensity
                                    </h2>
                                    <div className="space-y-3">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={intensity}
                                            onChange={(e) => setIntensity(parseInt(e.target.value))}
                                            className={`w-full h-3 rounded-full appearance-none cursor-pointer ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
                                                }`}
                                            style={{
                                                backgroundImage: `linear-gradient(to right, ${selectedPainType.darkColor}, ${selectedPainType.color})`
                                            }}
                                        />
                                        <div className="flex justify-between text-sm">
                                            <span>Mild</span>
                                            <span className={`px-3 py-1 rounded-full font-bold ${intensity < 4
                                                    ? 'bg-green-100 text-green-800'
                                                    : intensity < 7
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {intensity}/10
                                            </span>
                                            <span>Severe</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold mb-3 flex items-center">
                                        <span className={`mr-2 p-2 rounded-lg ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>📝</span>
                                        Additional Notes
                                    </h2>
                                    <textarea
                                        value={additionalNotes}
                                        onChange={(e) => setAdditionalNotes(e.target.value)}
                                        placeholder="Describe your symptoms, duration, triggers..."
                                        className={`w-full p-3 rounded-xl border ${theme.border} ${theme.inputBg} focus:ring-2 focus:ring-indigo-400 focus:border-transparent`}
                                        rows={3}
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={analyzePain}
                                        disabled={isLoading || !selectedBodyPart || painPoints.length === 0}
                                        className={`flex-1 py-3 px-4 rounded-xl font-medium text-white transition-all ${isLoading || !selectedBodyPart || painPoints.length === 0
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : `${theme.primary} ${theme.primaryHover} shadow-lg hover:shadow-xl`
                                            }`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analyzing...
                                            </span>
                                        ) : (
                                            'Analyze Pain'
                                        )}
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className={`py-3 px-4 rounded-xl font-medium border ${theme.border} hover:bg-opacity-20 hover:bg-gray-500 transition-colors`}
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => setShowContextForm(!showContextForm)}
                                        className={`text-sm font-medium flex items-center ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}
                                    >
                                        {showContextForm ? (
                                            <>
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                                </svg>
                                                Hide Medical Context
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                                Add Medical Context
                                            </>
                                        )}
                                    </button>
                                </div>

                                {showContextForm && (
                                    <div className={`p-4 rounded-xl border ${theme.border} space-y-3 mt-3`}>
                                        <h3 className="font-medium text-lg flex items-center">
                                            <span className={`mr-2 p-2 rounded-lg ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>🏥</span>
                                            Medical Context
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className={`block text-sm font-medium mb-1 ${theme.secondaryText}`}>Age</label>
                                                <input
                                                    type="number"
                                                    value={context.age}
                                                    onChange={(e) => setContext({ ...context, age: e.target.value })}
                                                    className={`w-full p-2 rounded-lg border ${theme.border} ${theme.inputBg}`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-1 ${theme.secondaryText}`}>Gender</label>
                                                <select
                                                    value={context.gender}
                                                    onChange={(e) => setContext({ ...context, gender: e.target.value })}
                                                    className={`w-full p-2 rounded-lg border ${theme.border} ${theme.inputBg}`}
                                                >
                                                    <option value="">Prefer not to say</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-1 ${theme.secondaryText}`}>Known Conditions</label>
                                                <input
                                                    type="text"
                                                    value={context.knownConditions}
                                                    onChange={(e) => setContext({ ...context, knownConditions: e.target.value })}
                                                    placeholder="e.g., diabetes, hypertension"
                                                    className={`w-full p-2 rounded-lg border ${theme.border} ${theme.inputBg}`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-1 ${theme.secondaryText}`}>Medications</label>
                                                <input
                                                    type="text"
                                                    value={context.medications}
                                                    onChange={(e) => setContext({ ...context, medications: e.target.value })}
                                                    placeholder="e.g., aspirin, insulin"
                                                    className={`w-full p-2 rounded-lg border ${theme.border} ${theme.inputBg}`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-1 ${theme.secondaryText}`}>Allergies</label>
                                                <input
                                                    type="text"
                                                    value={context.allergies}
                                                    onChange={(e) => setContext({ ...context, allergies: e.target.value })}
                                                    placeholder="e.g., penicillin, nuts"
                                                    className={`w-full p-2 rounded-lg border ${theme.border} ${theme.inputBg}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`p-6 border-r ${theme.border} flex flex-col items-center justify-center`}>
                            <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <Stage
                                    width={400}
                                    height={600}
                                    ref={stageRef}
                                    onClick={handleStageClick}
                                    style={{ backgroundColor: theme.canvasBg }}
                                >
                                    <Layer>
                                        <Group>
                                            {BODY_OUTLINE.map((part, index) => (
                                                <Rect
                                                    key={index}
                                                    x={part.x}
                                                    y={part.y}
                                                    width={part.width}
                                                    height={part.height}
                                                    cornerRadius={part.radius || 0}
                                                    fill={darkMode ? '#374151' : '#E0E7FF'}
                                                    stroke={darkMode ? '#4B5563' : '#818CF8'}
                                                    strokeWidth={1.5}
                                                    shadowColor={darkMode ? 'black' : 'gray'}
                                                    shadowBlur={5}
                                                    shadowOpacity={0.3}
                                                />
                                            ))}
                                        </Group>

                                        {painPoints.map((point) => (
                                            <Group key={point.id} onClick={() => removePainPoint(point.id)}>
                                                <Circle
                                                    x={point.x}
                                                    y={point.y}
                                                    radius={8 + (point.intensity * 2)}
                                                    fill={darkMode ? point.type.darkColor : point.type.color}
                                                    opacity={0.8}
                                                    stroke="white"
                                                    strokeWidth={2}
                                                    shadowColor="black"
                                                    shadowBlur={5}
                                                    shadowOpacity={0.3}
                                                />
                                                <Text
                                                    x={point.x - 10}
                                                    y={point.y - 10}
                                                    text={point.type.symbol}
                                                    fontSize={20}
                                                    fill="white"
                                                    fontStyle="bold"
                                                />
                                            </Group>
                                        ))}

                                        {selectedBodyPart && (
                                            <Text
                                                x={200}
                                                y={550}
                                                fontSize={16}
                                                fontStyle="bold"
                                                fill={darkMode ? '#A5B4FC' : '#4F46E5'}
                                                align="center"
                                                width={400}
                                            />
                                        )}
                                    </Layer>
                                </Stage>
                            </div>
                            <p className={`mt-4 text-sm text-center ${theme.secondaryText}`}>
                                Click on the body to mark pain locations. Click on pain points to remove them.
                            </p>
                        </div>

                        <div className="p-6">
                            {aiResponse ? (
                                <div className={`rounded-xl overflow-hidden shadow-lg ${aiResponse.emergency
                                        ? 'bg-red-50 border border-red-200'
                                        : aiResponse.severity === 'high'
                                            ? 'bg-orange-50 border border-orange-200'
                                            : 'bg-green-50 border border-green-200'
                                    } ${darkMode ? '!bg-opacity-20' : ''}`}>
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start mb-5">
                                            <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${aiResponse.emergency
                                                    ? 'bg-red-100 text-red-600'
                                                    : aiResponse.severity === 'high'
                                                        ? 'bg-orange-100 text-orange-600'
                                                        : 'bg-green-100 text-green-600'
                                                } ${darkMode ? '!bg-opacity-70' : ''}`}>
                                                {aiResponse.emergency ? (
                                                    <span className="text-2xl">🚨</span>
                                                ) : aiResponse.severity === 'high' ? (
                                                    <span className="text-2xl">⚠️</span>
                                                ) : (
                                                    <span className="text-2xl">ℹ️</span>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-xl font-bold">
                                                    {aiResponse.emergency
                                                        ? 'Emergency Attention Needed!'
                                                        : aiResponse.severity === 'high'
                                                            ? 'Potentially Serious Condition'
                                                            : 'Preliminary Assessment'}
                                                </h3>
                                                <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${aiResponse.emergency
                                                        ? 'bg-red-100 text-red-800'
                                                        : aiResponse.severity === 'high'
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-green-100 text-green-800'
                                                    } ${darkMode ? '!bg-opacity-50' : ''}`}>
                                                    Severity: {aiResponse.severity}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`mb-6 p-4 rounded-lg ${darkMode
                                                ? aiResponse.emergency
                                                    ? 'bg-red-900 bg-opacity-30'
                                                    : aiResponse.severity === 'high'
                                                        ? 'bg-orange-900 bg-opacity-30'
                                                        : 'bg-green-900 bg-opacity-30'
                                                : 'bg-white'
                                            }`}>
                                            <p className={`${theme.text} font-medium`}>{aiResponse.response}</p>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold mb-3 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Recommendations
                                            </h4>
                                            <ul className="space-y-2">
                                                {aiResponse.recommendations.map((rec: string, i: number) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 ${aiResponse.emergency
                                                                ? 'bg-red-100 text-red-600'
                                                                : aiResponse.severity === 'high'
                                                                    ? 'bg-orange-100 text-orange-600'
                                                                    : 'bg-green-100 text-green-600'
                                                            }`}>
                                                            {i + 1}
                                                        </span>
                                                        <span className={theme.text}>{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {aiResponse.followUpQuestions.length > 0 && (
                                            <div>
                                                <h4 className="text-lg font-semibold mb-3 flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    Follow-up Questions
                                                </h4>
                                                <ul className="space-y-2">
                                                    {aiResponse.followUpQuestions.map((q: string, i: number) => (
                                                        <li key={i} className="flex items-start">
                                                            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">
                                                                ?
                                                            </span>
                                                            <span className={theme.text}>{q}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {aiResponse.emergency && (
                                            <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-red-900 bg-opacity-40' : 'bg-red-100'
                                                }`}>
                                                <div className="flex items-center">
                                                    <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                                    </svg>
                                                    <h4 className="font-bold text-red-800">
                                                        Emergency Warning
                                                    </h4>
                                                </div>
                                                <p className={`mt-2 ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                                                    🚑 This may require immediate medical attention. Please seek emergency care or call your local emergency number.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className={`h-full flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed ${theme.border} ${darkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-50'}`}>
                                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium">
                                        No analysis yet
                                    </h3>
                                    <p className={`mt-2 text-center text-sm ${theme.secondaryText}`}>
                                        Mark your pain locations and click "Analyze Pain" to get personalized insights about your symptoms.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Sketch;