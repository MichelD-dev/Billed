/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor, within } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockedStore from "../__mocks__/store";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

jest.mock("../app/store", () => mockedStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      expect(windowIcon.classList.contains("active-icon")).toBe(true); //TODO 5
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map(a => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      // console.log(dates);
      // console.log(datesSorted);
      expect(dates).toEqual(datesSorted);
    });
    //TODO 6
    describe("When I click on New Bill Button", () => {
      test("I should be sent on New Bill form", () => {
        const onNavigate = pathname => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const bills = new Bills({
          document,
          onNavigate,
          store: mockedStore,
          localStorage: window.localStorage,
        });

        document.body.innerHTML = BillsUI({ data: bills });

        const buttonNewBill = screen.getByTestId("btn-new-bill");
        expect(buttonNewBill).toBeTruthy(); //TODO nécessaire?
        const handleClickNewBill = jest.fn(e => bills.handleClickNewBill(e));
        buttonNewBill.addEventListener("click", handleClickNewBill);
        fireEvent.click(buttonNewBill);
        expect(handleClickNewBill).toHaveBeenCalled();
      });
    });
    describe("When I click on one eye icon", () => {
      test("I should open a modal displaying the uploaded image file", () => {
        const onNavigate = pathname => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        const billPage = new Bills({
          document,
          onNavigate,
          store: mockedStore,
          localStorage: window.localStorage,
        });

        $.fn.modal = jest.fn();

        document.body.innerHTML = BillsUI({ data: bills });

        const billsTable = screen.getByTestId("tbody");
        const iconEyes = within(billsTable).getAllByTestId("icon-eye");

        const handleClickIconEye = jest.fn(icon =>
          billPage.handleClickIconEye(icon)
        );
        iconEyes.forEach(iconEye => {
          iconEye.addEventListener("click", () => handleClickIconEye(iconEye));
          fireEvent.click(iconEye);
        });
        expect(handleClickIconEye).toHaveBeenCalled();
        expect(screen.getByText("Justificatif")).toBeVisible()
      });
    });
    describe("When I click on one eye icon", () => {
      test.todo("I should open a modal displaying the uploaded image file");
    });
  });
});
