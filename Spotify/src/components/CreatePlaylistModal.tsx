import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Modal from './Modal'
import { useCreatePlaylistMutation } from '@/modules/playlist/api'

interface CreatePlaylistModalProps {
    isOpen: boolean
    onClose: () => void
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [name, setName] = useState('')
    const [createPlaylist, { isLoading }] = useCreatePlaylistMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createPlaylist(name).unwrap()
            setName('')
            onClose()
        } catch (error) {
            console.error('Failed to create playlist:', error)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Playlist">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Playlist Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter playlist name"
                        required
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'Create Playlist'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default CreatePlaylistModal
