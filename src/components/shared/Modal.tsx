import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogContent,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog'

interface ModalProps {
    trigger: React.ReactNode
    title?: string
    description?: string
    children: React.ReactNode
    showCloseButton?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            trigger,
            children,
            title,
            description,
            showCloseButton = true,
            open,
            onOpenChange,
        },
        ref
    ) => {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent
                    ref={ref}
                    className="sm:max-w-2xl max-h-[90vh] overflow-hidden"
                >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">{children}</div>
                    {showCloseButton && (
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        )
    }
)

Modal.displayName = 'Modal'

export default Modal
