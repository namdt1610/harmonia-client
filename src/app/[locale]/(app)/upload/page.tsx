'use client'

import UploadTrackForm from '@/modules/upload/components/UploadTrackForm'

export const metadata = {
    title: 'Upload',
    description: 'Upload page',
}

export const UploadTrackPage = () => {
    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Upload Your Track</h1>
            <UploadTrackForm />
        </div>
    )
}
