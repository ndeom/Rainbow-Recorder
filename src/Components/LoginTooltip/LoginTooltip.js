import styled from "styled-components";
import StatusTooltip from "Components/StatusTooltip/StatusTooltip";

const LoginTooltip = styled(StatusTooltip)`
    bottom: -18px;
    z-index: 1;
    &:before {
        border-right: none;
        border-bottom: none;
        top: -5px;
    }
`;

export default LoginTooltip;
