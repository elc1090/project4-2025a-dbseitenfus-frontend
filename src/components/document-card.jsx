'use client'

import { useRouter, useParams } from "next/navigation"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { FileText, Link, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteDocument } from "@/lib/api"

//Dropdown Menu
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DocumentCard({ document }) {
    const router = useRouter()

    async function handleDelete(e) {
        e.stopPropagation()  // evita que o clique propague para o card (evitando redirecionamento)

        const confirmDelete = window.confirm("Tem certeza que deseja excluir este documento?")
        if (!confirmDelete) return

        try {
            const res = await deleteDocument(document.id)
            if (res.status === 204) {
                alert("Documento excluído com sucesso!")
                router.refresh() 
            } else {
                console.log("Erro ao excluir o documento.")
            }
        } catch (error) {
            alert(error.message)
        }
    }


    return (
        <Card className="bg-stone-50" onClick={() => router.push(`/document/${document.id}`)}>
            <CardHeader className="flex flex-row items-center justify-between">
                <FileText size={19} color="#3e9392" className="mr-3" />
                <CardTitle className="flex-1 px-2 text-sm truncate"> {document.title}</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                        <Button variant="ghost" className="p-0 w-3 h-3">
                            <MoreVertical size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuCheckboxItem>
                            Abrir em nova aba
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem onClick={handleDelete}>
                            Excluir
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-2 bg-white h-[100px] p-1.5 text-xs">{document.plain_text}</p>
            </CardContent>
            <CardFooter>
                <p className="text-xs">Criado por {document.user.first_name} {document.user.last_name} • {new Date(document.created_at).toLocaleDateString()}</p>
            </CardFooter>
        </Card>
    )
}