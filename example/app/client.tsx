// app/client.tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/start'
import { createRouter } from './clientRouter'

const router = createRouter()

hydrateRoot(document.getElementById('root')!, <StartClient router={router} />)
