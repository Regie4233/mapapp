import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Shift } from "@/lib/type"
import { formatDateToMonthYear } from "@/lib/utils"

export default function ShiftCards({data}:{data:Shift}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.title || "Session Title"}</CardTitle>
                <CardDescription>{data.description ||'some description'}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{formatDateToMonthYear(new Date(data.shift_date))}</p>
                <p>{data.location}</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>

    )
}
