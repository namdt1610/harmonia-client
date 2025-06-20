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

type Props = {
    control: Control<any>
}

export const UsernameField = ({ control }: Props) => {
    const t = useTranslations('LoginPage')

    return (
        <FormField
            control={control}
            name="username_or_email"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('username_or_email')}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                autoComplete="username_or_email"
                                placeholder={`${t('username_or_email')}`}
                                {...field}
                            />
                            {!!field.value && (
                                <Button
                                    size="icon"
                                    type="button"
                                    variant="link"
                                    onClick={() => field.onChange('')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2"
                                >
                                    <X className="text-muted-foreground" />
                                </Button>
                            )}
                            
                        </div>
                    </FormControl>
                    <FormDescription>
                        {t('usernameDescription')}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
