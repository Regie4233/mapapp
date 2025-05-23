import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ShiftOccurrence } from "@/lib/type"
import { formatDateToMonthYear } from "@/lib/utils"

export default function ShiftCards(data: ShiftOccurrence) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.title || "Session Title"}</CardTitle>
                <CardDescription>{data.description ||'some description'}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{formatDateToMonthYear(new Date(data.shiftDate))}</p>
                <p>{data.shiftLocation}</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>

    )
}
