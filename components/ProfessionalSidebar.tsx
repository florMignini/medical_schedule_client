'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import SidebarItems from '@/app/(professional)/professional/components/SidebarItems'
import onlyLogo from '../public/assets/onlyIcon.png'

const sidebarVariants = {
  open: { x: 0 },
  closed: { x: '-100%' },
}

export default function Sidebar({isOpen, setIsOpen, variant}: {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  variant: 'desktop' | 'mobile'
}) {

  return (
    <>
      {/* mobile only toggle button */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={1} /> : <Image
          src={onlyLogo}
          alt='Only Logo'
          width={35}
          height={35}
          />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar mobile (motion) */}
      <motion.aside
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white/10 backdrop-blur-md border-r border-white/20 shadow-lg z-50 md:hidden"
      >
        <div className="p-6 text-white">
          <SidebarItems
          setIsOpen={setIsOpen}
          />
        </div>
      </motion.aside>

      {/* Sidebar estático en desktop */}
      <aside className="hidden md:flex md:flex-col w-64 h-screen bg-transparent backdrop-blur-lg text-white p-6">
        <SidebarItems
        setIsOpen={setIsOpen}
        />
      </aside>
    </>
  )
}
