'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { getDocument, saveDocument } from '@/lib/api'

import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Redo2,
  Undo2,
  Quote,
  X,
} from 'lucide-react'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'

import { Button } from '@/components/ui/button'
import { EditorContent } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'
import UnderlineExtension from '@tiptap/extension-underline'

import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

import './collaboration-cursor.css'
import { Input } from '@/components/ui/input'

import { WebsocketProvider } from 'y-websocket'


export default function DocumentPage() {
  const router = useRouter()

  const params = useParams()
  const documentId = params.id

  const [document, setDocument] = useState(null)
  const [editor, setEditor] = useState(null)

  const ydocRef = useRef(null)
  const providerRef = useRef(null)
  const editorRef = useRef(null)

  const titleInputRef = useRef(null)

  const COLORS = [
    '#e63946', '#f1faee', '#a8dadc', '#457b9d',
    '#1d8557', '#ffb703', '#fb8500', '#6a994e',
    '#9b5de5', '#f72585',
  ]

  useEffect(() => {


    let isCancelled = false

    async function init() {
      const ydoc = new Y.Doc()

      const provider = new WebsocketProvider(
        'wss://demos.yjs.dev/ws', `room-document-${documentId}`, ydoc
      )
      // const provider = new WebrtcProvider(`room-${documentId}`, ydoc, {
      //   signaling: [
      //     'wss://demos.yjs.dev',        ],
      //   // opcional: para forçar reconexões automáticas
      //   maxConns: 20,
      //   filterBcConns: true,
      // })
      ydocRef.current = ydoc
      providerRef.current = provider

      // 👇 Recupera usuário do localStorage
      const savedUser = (() => {
        try {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            return JSON.parse(userStr)
          }
        } catch (e) {
          console.warn('Erro ao ler user do localStorage:', e)
        }
        return { username: 'Usuário' }
      })()


      try {
        const response = await getDocument(documentId)
        if (isCancelled) return

        setDocument(response)

        if (response?.content) {
          try {
            const update = Uint8Array.from(atob(response.content), c => c.charCodeAt(0))
            Y.applyUpdate(ydoc, update)
          } catch (e) {
            console.warn('Falha ao aplicar update do Yjs:', e)
          }
        }

        const { Editor } = await import('@tiptap/react')

        const newEditor = new Editor({
          extensions: [
            StarterKit.configure({
              history: false,
              heading: false,
              bulletList: false,
              orderedList: false,
              blockquote: false,
            }),
            UnderlineExtension,
            Heading.configure({ levels: [1, 2, 3] }),
            BulletList,
            OrderedList,
            Blockquote,
            Collaboration.configure({ document: ydoc }),
            CollaborationCursor.configure({
              provider,
              user: {
                name: savedUser.username || 'Usuário',
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
              },

            }),
          ],
        })

        if (isCancelled) {
          newEditor.destroy()
          return
        }

        editorRef.current = newEditor
        setEditor(newEditor)
      } catch (error) {
        console.error('Erro ao inicializar o documento:', error)
      }
    }

    init()

    return () => {
      isCancelled = true
      editorRef.current?.destroy()
      providerRef.current?.destroy()
      ydocRef.current?.destroy()
      editorRef.current = null
      providerRef.current = null
      ydocRef.current = null
      setEditor(null)
    }
  }, [documentId])

  async function handleSave() {
    if (!editorRef.current || !document || !ydocRef.current) return

    try {
      const update = Y.encodeStateAsUpdate(ydocRef.current)
      const base64Update = btoa(String.fromCharCode(...update))
      const plain_text = editor.getText()
      console.log(plain_text)

      await saveDocument(documentId, document.title, base64Update, plain_text)
      alert('Documento salvo!')
    } catch (error) {
      console.error('Erro ao salvar documento:', error)
      alert('Erro ao salvar documento.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <div className="w-full h-[100px] flex items-center px-4 bg-white">
        <FileText className="mr-2" size={60} />
        <div className="max-w-3xl flex flex-col w-full justify-start">
          <Input
            className="border-white font-bold"
            ref={titleInputRef}
            value={document?.title || ''}
            onChange={(e) => {
              if (!document) return
              setDocument({ ...document, title: e.target.value })
            }}
          />
          {/* <h1 className="text-lg font-medium">{document?.title || 'Carregando...'}</h1> */}
          <Menubar className="border-white shadow-none">
            <MenubarMenu>
              <MenubarTrigger>Arquivo</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={(e) => {
                  e.preventDefault()
                  titleInputRef.current?.focus()
                }}>Renomear</MenubarItem>
                <MenubarItem onClick={handleSave}>Salvar</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Editar</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={(e) => {
                  e.preventDefault()
                  editor?.chain().focus().undo().run()
                }}>Desfazer</MenubarItem>

                <MenubarItem onClick={(e) => {
                  e.preventDefault()
                  editor?.chain().focus().redo().run()
                }}>Refazer</MenubarItem>

                <MenubarItem onClick={(e) => {
                  e.preventDefault()
                  editor?.chain().focus().selectAll().run()
                }}>Selecionar tudo</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Navegação</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={(e) => {
                  router.push('/')
                }}>Voltar</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Sobre</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={(e) => {
                  router.push('https://tiptap.dev/docs/editor/getting-started/overview')
                }}>Sobre o editor TipTap</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <div className="ml-auto">
          <Button onClick={handleSave}>Salvar arquivo</Button>
        </div>
      </div>

      <div className="flex justify-center w-full flex-1 p-5">
        <div className="prose max-w-4xl w-full bg-white p-5 rounded shadow min-h-[500px] tiptap">
          {editor ? (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive('bold') ? 'bg-gray-200' : ''}
                  title="Negrito"
                >
                  <Bold className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive('italic') ? 'bg-gray-200' : ''}
                  title="Itálico"
                >
                  <Italic className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={editor.isActive('underline') ? 'bg-gray-200' : ''}
                  title="Sublinhado"
                >
                  <Underline className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
                  title="Título H1"
                >
                  H1
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
                  title="Título H2"
                >
                  H2
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
                  title="Título H3"
                >
                  H3
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
                  title="Lista não ordenada"
                >
                  <List className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
                  title="Lista ordenada"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
                  title="Citação"
                >
                  <Quote className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                  title="Limpar formatação"
                >
                  <X className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().undo().run()}
                  title="Desfazer"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editor.chain().focus().redo().run()}
                  title="Refazer"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </div>

              <EditorContent editor={editor} />
            </>
          ) : (
            <p>Carregando editor...</p>
          )}
        </div>
      </div>
    </div>
  )
}
