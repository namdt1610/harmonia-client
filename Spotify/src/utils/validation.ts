import { z } from 'zod'

export const uploadTrackSchema = z.object({
    file: z
        .lazy(() =>
            typeof window !== 'undefined' ? z.instanceof(FileList) : z.any()
        )
        .refine(
            (file) =>
                file.length > 0 &&
                ['audio/mpeg', 'audio/wav', 'audio/flac'].includes(
                    file[0].type
                ),
            { message: 'File không hợp lệ!' }
        ),
    title: z.string().min(1, { message: 'Title không được để trống' }),
    artistId: z.string().min(1, { message: 'Phải chọn nghệ sĩ' }),
    albumId: z.string().nullable().optional(),
})
