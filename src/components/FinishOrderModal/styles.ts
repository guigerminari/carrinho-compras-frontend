import styled from "styled-components";

export const Conteiner = styled.form`
    h2 {
        color: #555;
        font-size: 1.5rem;
        margin-bottom: 2rem;
    }

    input {
        width: 100%;
        padding: 0 1.5rem;
        height: 4rem;
        border-radius: 0.25rem;
        margin-top: 1rem;

        border 1px solid #d7d7d7;
        background: #e7e9ee;

        font-weight: 400;
        font-size: 1rem;

        &::placehoder {
            color: #ddd;
        }
    }

    button[type="submit"] {
        width: 100%;
        padding: 0 1.5rem;
        height: 4rem;
        background: green;
        color: #fff;
        border-radius: 0.25rem;
        border: 0;
        font-size: 1rem;
        margin-top: 1.5rem;
        font-weight: 600;
     
        transition: filter 0.2s;

        &:hover {
            filter: brightness(0.9)
        }
    }
`

export const Total = styled.div`
  display: flex;
  align-items: baseline;
  margin: 2rem 0 1rem 0;

  span {
    color: #999;
    font-weight: bold;
  }

  strong {
    font-size: 28px;
    margin-left: 5px;
  }
`