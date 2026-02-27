import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api"

const SUGGESTIONS = [
  "Combien coûte la création d'une société ?",
  "Quels sont vos services ?",
  "Comment créer une micro-entreprise ?",
  "Où sont vos bureaux ?",
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour ! Je suis l'assistant Juridique Pro. Comment puis-je vous aider ? Création d'entreprise, formalités, tarifs... posez-moi vos questions !",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: "user", content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Désolé, je rencontre un problème technique. Contactez-nous au +33 7 58 74 56 23.",
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Désolé, je ne parviens pas à me connecter. Contactez-nous directement au +33 7 58 74 56 23 ou par email à nze.claudia@yahoo.fr.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
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
            {messages.map((msg, i) => (
              <div
                key={i}
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
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
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

            {/* Suggestions (show only at start) */}
            {messages.length === 1 && !loading && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-muted-foreground font-medium">Questions fréquentes :</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                input.trim() && !loading
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
