
import { DynamicSelect } from "./";
import books from "../data/books"

export const Content = () => {
  return (
    <DynamicSelect data={books} />
  );
};
