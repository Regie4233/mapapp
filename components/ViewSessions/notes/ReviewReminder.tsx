
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ReviewReminder({ onDismiss, onContinue }: { onDismiss: () => void; onContinue: () => void; }) {
    return (
        <Card className=" border-[#D7DCE2] bg-white m-4 border">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Please remember to add your reviews for completed sessions
                </CardTitle>
                <CardDescription className="pt-2 text-base">
                    Your feedback helps us improve the mentoring experience.
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-3">
                <Button variant="ghost" onClick={onDismiss}>
                    Dismiss
                </Button>
                <Button
                    onClick={onContinue}
                    className="bg-[#FDEEAE] text-black hover:bg-[#FDEEAE]/90"
                >
                    Continue
                </Button>
            </CardFooter>
        </Card>
    );
}