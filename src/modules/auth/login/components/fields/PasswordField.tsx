import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Control } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

type Props = {
    control: Control<any>
}

export const PasswordField = ({ control }: Props) => {
    const t = useTranslations('LoginPage')
    const [show, setShow] = useState(false)
    const toggle = () => setShow((prev) => !prev)

    return (
        <FormField
            control={control}
            name="password"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                        <div className="relative flex items-center">
                            <Input
                                type={show ? 'text' : 'password'}
                                placeholder={`${t('password')}`}
                                {...field}
                                autoComplete="current-password"
                            />
                            {!!field.value && (
                                <div className="flex items-center justify-end absolute right-0">
                                    {show ? (
                                        <Button
                                            size="icon"
                                            type="button"
                                            variant="link"
                                            onClick={toggle}
                                        >
                                            <EyeIcon className="text-muted-foreground" />
                                        </Button>
                                    ) : (
                                        <Button
                                            size="icon"
                                            type="button"
                                            variant="link"
                                            onClick={toggle}
                                        >
                                            <EyeOffIcon className="text-muted-foreground" />
                                        </Button>
                                    )}
                                    <Button
                                        size="icon"
                                        type="button"
                                        variant="link"
                                        onClick={() => field.onChange('')}
                                    >
                                        <X className="text-muted-foreground" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormDescription>
                        {t('passwordDescription')}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
