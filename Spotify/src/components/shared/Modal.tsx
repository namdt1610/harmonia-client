import React from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Modal content */}
            <div
                className={`relative rounded-lg p-6 w-full max-w-md mx-4 bg-gray-900 text-popover-foreground transform transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
                {/* Header */}
                {title && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">{title}</h2>
                    </div>
                )}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Content */}
                <div className="mt-2">{children}</div>
            </div>
        </div>
    )
}

export default Modal
