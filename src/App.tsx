import  { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        setTranscript(transcriptText);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  }, [isListening, recognition]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold">Speech Recognition Demo</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time speech recognition tool designed to help the deaf and hard of hearing community
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          {/* Control Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleListening}
                  className={`p-4 rounded-full transition-all ${
                    isListening
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">
                    {isListening ? 'Listening...' : 'Click to Start'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {isListening ? 'Click to stop' : 'Ready to convert speech'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transcript Display */}
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Transcript</h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] text-gray-700">
              {transcript || (
                <span className="text-gray-400 italic">
                  Speech will appear here when you start speaking...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
      
      </div>
    </div>
  );
}

export default App;