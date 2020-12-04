import styled from "styled-components";

const StatusTooltip = styled.div`
    font-size: 12px;
    position: absolute;
    padding: 4px 8px;
    border-radius: 6px;
    border-style: solid;
    border-width: 1px;
    border-color: ${(props) =>
        props.status === "success"
            ? "var(--color-input-tooltip-success-border)"
            : "var(--color-input-tooltip-error-border)"};
    background-color: ${(props) =>
        props.status === "success"
            ? "var(--color-input-tooltip-success-bg)"
            : "var(--color-input-tooltip-error-bg)"};
    color: ${(props) =>
        props.status === "success"
            ? "var(--color-input-tooltip-success-text)"
            : "var(--color-input-tooltip-error-text)"};

    /* Tooltip point */
    &:before,
    &:after {
        content: "";
        position: absolute;
        transform: rotate(45deg);
        background-color: ${(props) =>
            props.status === "success"
                ? "var(--color-input-tooltip-success-bg)"
                : "var(--color-input-tooltip-error-bg)"};
    }
    &:after {
        top: -4px;
        left: 16px;
        width: 8px;
        height: 8px;
    }
    &:before {
        width: 9px;
        height: 9px;
        top: -4.5px;
        left: 14.5px;
        z-index: -1;
        border-style: solid;
        border-width: 1px;
        border-color: ${(props) =>
            props.status === "success"
                ? "var(--color-input-tooltip-success-border)"
                : "var(--color-input-tooltip-error-border)"};
    }
`;

export default StatusTooltip;
