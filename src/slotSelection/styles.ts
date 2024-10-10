import styled from "styled-components";

const SlotSelectorWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  position: absolute;

  .service-container {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid black;
    border-radius: 5px;
    padding: 10px;

    p {
      min-width: 100px;
    }

    .slots-container {
      display: flex;
      gap: 10px;
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        box-sizing: border-box;
        border: 1px solid black;
        border-radius: 5px;
        padding: 5px;
        width: 100px;
        text-align: center;
        cursor: pointer;

        &.booked {
          background-color: red;
        }

        &.selected {
          background-color: green;
        }

        &.conflict {
          background-color: gray;
        }
      }
    }
  }
`;

export default SlotSelectorWrapper;
