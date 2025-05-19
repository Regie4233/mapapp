import { useAppSelector } from "@/lib/hooks";
import UserInfoSkeleton from "./UserInfoSkeleton";

export default function TestUserInfo() {
    const authUser = useAppSelector((state) => state.sessions.authUser);

    if(authUser === null) return(<UserInfoSkeleton />)
    return (
        <>
            <h1>Dashboard</h1>
            <p>This is the dashboard page.</p>
            <p>Welcome, {authUser.name}</p>
            <p>Your email is {authUser.email}</p>
            <p>Your phone number is {authUser.phone}</p>
            <p>Your title is {authUser.title}</p>
            <p>Your about is {authUser.about}</p>
            <p>Your privilage is {authUser.privilage}</p>
        </>
    )
}
