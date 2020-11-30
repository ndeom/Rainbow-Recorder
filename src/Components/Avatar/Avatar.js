import React, { useContext } from "react";
import { SessionContext } from "Components/SessionContext";
import { ReactComponent as AvatarIcon } from "Images/user.svg";

export default function Avatar() {
    const { session } = useContext(SessionContext);
    return session.profilePicture ? (
        <img alt="User avatar" src={session.profilePicture} />
    ) : (
        <AvatarIcon />
    );
}
