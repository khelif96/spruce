import { render, screen, userEvent, waitFor } from "test_utils";
import PageSizeSelector from ".";

describe("pageSizeSelector", () => {
  it("selecting page size should call onChange prop", async () => {
    const onChange = jest.fn();
    render(
      <PageSizeSelector
        data-cy="page-size-selector"
        value={10}
        onChange={onChange}
      />
    );
    userEvent.click(screen.queryByText("10 / page"));
    await waitFor(() => {
      expect(screen.queryByText("20 / page")).toBeVisible();
    });
    userEvent.click(screen.queryByText("20 / page"));
    expect(onChange).toHaveBeenCalledWith(20);
  });
});
