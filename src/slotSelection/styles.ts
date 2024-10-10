import styled from "styled-components";

const SlotSelectorWrapper = styled.div`
  padding: 10px;
  .service-container {
    display: flex;

    .slots-container {
      display: flex;
      gap: 10px;

      li {
        border: 1px solid black;
        border-radius: 10px;
      }
    }
  }
`;

export default SlotSelectorWrapper;
