import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control } from 'react-hook-form'
import { useTranslations } from 'next-intl'

interface Props {
    control: Control<any>
}

export const RememberMeCheckbox = ({ control }: Props) => {
    const t = useTranslations('LoginPage')

    return (
        <FormField
            control={control}
            name="remember_me"
            render={({ field }) => (
                <FormItem className="flex justify-start items-center">
                    <div className="flex justify-center items-center">
                        <FormControl>
                            <Input
                                type="checkbox"
                                checked={field.value || false}
                                onChange={(e) =>
                                    field.onChange(e.target.checked)
                                }
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                autoComplete="remember-me"
                                className="w-5 h-5 mr-2"
                            />
                        </FormControl>
                        <FormLabel className="text-muted-foreground">
                            {t('rememberMe')}
                        </FormLabel>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
