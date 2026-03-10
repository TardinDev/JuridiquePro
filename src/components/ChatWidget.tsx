import { useState, useRef, useEffect, useMemo } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { cn } from "@/lib/utils"
import type { UIMessage } from "ai"

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api"

const SUGGESTIONS = [
  "Combien coûte la création d'une société ?",
  "Quels sont vos services ?",
  "Comment créer une micro-entreprise ?",
  "Où sont vos bureaux ?",
]

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Bonjour ! Je suis l'assistant Juridique Pro. Comment puis-je vous aider ? Création d'entreprise, formalités, tarifs... posez-moi vos questions !",
    },
  ],
}

function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && "text" in p)
    .map((p) => p.text)
    .join("")
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState("")

  const transport = useMemo(
    () => new DefaultChatTransport({ api: `${API_BASE}/chat` }),
    []
  )

  const {
    messages,
    sendMessage,
    status,
    error,
  } = useChat({
    transport,
    messages: [WELCOME_MESSAGE],
    onError: (err) => {
      console.error("Chat error:", err)
    },
  })

  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return
    sendMessage({ text: text.trim() })
    setInputValue("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(inputValue)
  }

  return (
    <>
      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-5 z-[60] w-[360px] max-w-[calc(100vw-40px)] transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex h-[520px] max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#627A93] to-[#39648F] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Assistant Juridique Pro</h3>
                <p className="text-xs text-white/70">En ligne — Réponse immédiate</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg) => {
              const text = getMessageText(msg)
              if (!text) return null
              return (
                <div
                  key={msg.id}
                  className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "")}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      msg.role === "assistant"
                        ? "bg-[#627A93]/10 text-[#627A93]"
                        : "bg-foreground/10 text-foreground"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "assistant"
                        ? "rounded-tl-md bg-card text-foreground border border-border"
                        : "rounded-tr-md bg-[#627A93] text-white"
                    )}
                  >
                    {text}
                  </div>
                </div>
              )
            })}

            {status === "submitted" && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#627A93]/10 text-[#627A93]">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#627A93]/10 text-[#627A93]">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-card text-foreground border border-border px-4 py-2.5 text-sm leading-relaxed">
                  Désolé, je ne parviens pas à me connecter. Contactez-nous directement au +33 7 58 74 56 23 ou par email à nze.claudia@yahoo.fr.
                </div>
              </div>
            )}

            {/* Suggestions (show only at start) */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-muted-foreground font-medium">Questions fréquentes :</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="block w-full rounded-xl border border-border bg-card px-3 py-2 text-left text-xs text-foreground transition-all hover:border-[#627A93]/30 hover:bg-[#627A93]/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border px-4 py-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez votre question..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                inputValue.trim() && !isLoading
                  ? "bg-[#627A93] text-white hover:bg-[#39648F]"
                  : "text-muted-foreground/30"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105",
          isOpen
            ? "bg-foreground/80 text-background hover:bg-foreground"
            : "bg-gradient-to-r from-[#627A93] to-[#39648F] text-white hover:shadow-xl hover:shadow-[#627A93]/25"
        )}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  )
}
