type SpeechRecognitionConstructor = new () => {
  lang: string
  interimResults: boolean
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  start: () => void
}

export function textToSpeech(text: string, lang = 'en-IN') {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  window.speechSynthesis.speak(utterance)
  return true
}

export function speechToText(onText: (text: string) => void, onUnavailable: () => void) {
  const Recognition = (window as Window & { webkitSpeechRecognition?: SpeechRecognitionConstructor; SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition
    ?? (window as Window & { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition
  if (!Recognition) { onUnavailable(); return () => undefined }
  const recognition = new Recognition()
  recognition.lang = 'en-IN'
  recognition.interimResults = false
  recognition.onresult = event => onText(event.results[0][0].transcript)
  recognition.onerror = onUnavailable
  recognition.start()
  return () => undefined
}
