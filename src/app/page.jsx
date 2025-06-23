'use client'
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import DocumentCard from "@/components/document-card"
import { getDocuments, createDocument } from "@/lib/api"
import { useSession } from "next-auth/react"
import { CircularProgress } from "@/components/ui/circular-progress"

export default function Home() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") {
      return; 
    }
    if (!session) {
      router.push('/login');
    }
    setIsAuthenticating(false);
  }, [status, session]);

  const [documents, setDocuments] = useState([])
  const [user, setUser] = useState([])

  useEffect(() => {
    async function fetchUser() {
      if (status != "authenticated" || !session || !session.user) {
        return;
      }
      setUser(session.user)
    }
    fetchUser()
  }, [status, session])

  useEffect(() => {
    async function fetchData() {
      if (!session || !session.user || status === "loading") {
        return;
      }
      const documents = await getDocuments(session.accessToken)
      setDocuments(documents)
    }
    fetchData()
  }, [status, session])

  async function onNewDocumentButtonClicked() {
    const newDocument = {
      title: "Documento sem título",
      content: "",
      plain_text: ""
    }
    const documentResponse = await createDocument(newDocument, session.accessToken)
    setDocuments((prevDocuments) => [...prevDocuments, documentResponse])
  }

  if (!isAuthenticating) {
    return (

      <div className="[--header-height:calc(theme(spacing.14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar onNewDocumentButtonClicked={onNewDocumentButtonClicked} user={user} />
            <SidebarInset>
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-2xl font-bold">Nenhum documento encontrado</h2>
                  <p className="text-gray-500">Clique no botão "Novo" e crie um documento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 p-3">
                  {documents.map((document) => (
                    <DocumentCard key={document.id} document={document} />
                  ))}
                </div>)}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    )
  } else {
    <div className="flex items-center justify-center h-screen">
      <CircularProgress />
    </div>
  }
}