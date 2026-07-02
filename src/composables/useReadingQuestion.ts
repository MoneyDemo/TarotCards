import { ref } from 'vue'

/**
 * Shared "what do you want to ask about" text (module-level singleton).
 *
 * Entered before drawing (QuestionInput) and consumed when composing the LLM
 * prompt (LlmPromptPanel), so both observe the same value without prop drilling —
 * matching the singleton pattern used by useTarotDraw.
 */
const question = ref('')

export function useReadingQuestion() {
  return { question }
}
