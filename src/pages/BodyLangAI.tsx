/* eslint-disable @typescript-eslint/no-explicit-any */
import { HealthAssistant } from '../lib/gemini';
import  { useState, useRef } from 'react';


const BodyLanguageTranslator = () => {
    const [description, setDescription] = useState('');
    const [ageGroup, setAgeGroup] = useState<'child' | 'adult' | 'elderly'>('adult');
    const [consciousness, setConsciousness] = useState<'alert' | 'confused' | 'unresponsive'>('alert');
    const [aiResponse, setAiResponse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const healthAssistant = useRef(new HealthAssistant());

    const analyzeSymptoms = async () => {
        if (!description.trim()) {
            alert('Please describe what you observe');
            return;
        }

        setIsLoading(true);
        setAiResponse(null);

        try {
            const visualData = {
                description,
                ageGroup,
                consciousnessLevel: consciousness
            };

            const response = await healthAssistant.current.assessVisualSymptoms(visualData);
            setAiResponse(response);
        } catch (error) {
            console.error('Error analyzing symptoms:', error);
            setAiResponse({
                response: "Sorry, we encountered an error processing your request.",
                severity: 'low',
                recommendations: ['Please try again'],
                followUpQuestions: [],
                emergency: false
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setDescription('');
        setAgeGroup('adult');
        setConsciousness('alert');
        setAiResponse(null);
    };

    return (
        <div className="max-w-3xl mt-[100px] mx-auto p-6 bg-white rounded-xl shadow-md">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-indigo-700 mb-2">AI Body Language Translator</h1>
                <p className="text-gray-600">
                    Describe what you see in someone else, and we'll tell you what might be wrong and what to do.
                </p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                        <div className="flex space-x-2">
                            {['child', 'adult', 'elderly'].map((group) => (
                                <button
                                    key={group}
                                    onClick={() => setAgeGroup(group as any)}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${ageGroup === group
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {group.charAt(0).toUpperCase() + group.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Consciousness Level</label>
                        <div className="flex space-x-2">
                            {['alert', 'confused', 'unresponsive'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setConsciousness(level as any)}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${consciousness === level
                                            ? level === 'alert'
                                                ? 'bg-green-600 text-white'
                                                : level === 'confused'
                                                    ? 'bg-yellow-600 text-white'
                                                    : 'bg-red-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="observation" className="block text-sm font-medium text-gray-700 mb-2">
                        What do you observe? (Be specific)
                    </label>
                    <textarea
                        id="observation"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={5}
                        placeholder="Example: 'He's sweating, clutching his chest, having trouble breathing, and seems confused'"
                    />
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={analyzeSymptoms}
                        disabled={isLoading || !description.trim()}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors ${isLoading || !description.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {isLoading ? 'Analyzing...' : 'Get Emergency Advice'}
                    </button>
                    <button
                        onClick={clearForm}
                        className="py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        Clear
                    </button>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                        <span className="text-blue-600">Analyzing the situation...</span>
                    </div>
                )}

                {aiResponse && (
                    <div className={`p-6 rounded-lg border ${aiResponse.emergency
                            ? 'bg-red-50 border-red-200'
                            : aiResponse.severity === 'high'
                                ? 'bg-orange-50 border-orange-200'
                                : 'bg-green-50 border-green-200'
                        }`}>
                        <div className="flex items-start mb-4">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${aiResponse.emergency
                                    ? 'bg-red-100 text-red-600'
                                    : aiResponse.severity === 'high'
                                        ? 'bg-orange-100 text-orange-600'
                                        : 'bg-green-100 text-green-600'
                                }`}>
                                {aiResponse.emergency ? '🚨' : aiResponse.severity === 'high' ? '⚠️' : 'ℹ️'}
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium">
                                    {aiResponse.emergency
                                        ? 'Emergency Detected!'
                                        : aiResponse.severity === 'high'
                                            ? 'Potential Serious Condition'
                                            : 'Preliminary Assessment'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Based on your observations
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-800">{aiResponse.response}</p>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Immediate Actions:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {aiResponse.recommendations.map((rec: string, i: number) => (
                                    <li key={i} className="text-gray-700">{rec}</li>
                                ))}
                            </ul>
                        </div>

                        {aiResponse.followUpQuestions.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Follow-up Questions:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    {aiResponse.followUpQuestions.map((q: string, i: number) => (
                                        <li key={i} className="text-gray-700">{q}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {aiResponse.emergency && (
                            <div className="mt-4 p-3 bg-red-100 rounded-md">
                                <p className="text-red-800 font-medium">
                                    🚑 This requires immediate medical attention. Call emergency services now.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">How to use this tool:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700 text-sm">
                        <li>Describe exactly what you see - movements, sounds, appearance</li>
                        <li>Include any unusual behaviors or physical signs</li>
                        <li>Select the correct age group and consciousness level</li>
                        <li>We'll provide immediate steps to help the person</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BodyLanguageTranslator;