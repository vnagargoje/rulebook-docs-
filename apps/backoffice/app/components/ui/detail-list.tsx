import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface DetailItem {
    label: string
    value: string
}

interface DetailListProps {
    title: string
    items: DetailItem[]
}

export function DetailList({ title, items }: DetailListProps) {
    return (
        <Card className='gap-0'>
            <CardHeader className='border-b'>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 py-6 md:grid-cols-2'>
                {items.map((item) => (
                    <div
                        key={item.label}
                        className='rounded-xl border border-border/70 bg-muted/30 px-4 py-3'>
                        <p className='text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground'>
                            {item.label}
                        </p>
                        <p className='mt-2 text-sm font-medium text-foreground'>{item.value}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
