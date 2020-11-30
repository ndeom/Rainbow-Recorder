import React, { useState, useRef } from "react";
import styled from "styled-components";
import { ReactComponent as EditIcon } from "Images/edit.svg";

const Div = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: ${(props) => props.fontSize || "16px"};
    font-weight: ${(props) => props.fontWeight || "400"};
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    margin-bottom: 12px;
`;

const StyledInput = styled.input`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    text-align: center;
`;

const StyledSpan = styled.span`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    text-align: center;
`;

const EditButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eee;
    position: absolute;
    right: -26px;

    width: 30px;
    height: 30px;
    transition: background-color 200ms ease;
    border: none;
    border-radius: 50%;
    cursor: pointer;

    /* SVG Edit Icon */
    svg {
        width: 18px;
        height: auto;
    }

    &:hover {
        background-color: lightgray;
    }
`;

export default function ModifiableTextField({ width, height, fontSize, fontWeight, children }) {
    const [editable, setEditable] = useState(false);
    const [hovered, setHovered] = useState(false);
    const toggleEditable = () => {
        console.log("editable: ", editable);
        setEditable((prevEditable) => !prevEditable);
    };
    const handleHoverEnter = () => setHovered(true);
    const handleHoverExit = () => setHovered(false);
    return (
        <Div
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverExit}
            width={width}
            height={height}
            fontSize={fontSize}
            fontWeight={fontWeight}
        >
            <Span editable={editable} width={width} height={height} children={children} />
            <Input editable={editable} children={children} />
            <Edit hovered={hovered} onClick={toggleEditable} />
        </Div>
    );
}

function Input({ editable, children }) {
    return editable ? <StyledInput defaultValue={children} /> : null;
}

function Span({ editable, children }) {
    return editable ? null : <StyledSpan>{children}</StyledSpan>;
}

function Edit({ hovered, onClick }) {
    return hovered ? (
        <EditButton onClick={onClick}>
            <EditIcon />
        </EditButton>
    ) : null;
}
