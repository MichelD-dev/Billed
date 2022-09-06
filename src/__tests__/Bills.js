/**
 * @jest-environment jsdom
 */
import { configure, screen, waitFor, within } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockedStore from "../__mocks__/store";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

jest.mock("../app/store", () => mockedStore);

// beforeEach(() => {
//   configure({
//     throwSuggestions: true,
//   });
// });

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

    // -------------------------------------------------------- //
    // -------------------------------------------------------- //
    // -------------------------------------------------------- //

    describe("When a bill data is corrupted", () => {
      test("the back-end should return a bill with unformatted date", async () => {
        // expect.assertions(1);
        // const initialBills = await mockedStore.bills().list();
        // const corruptBills = [{ ...initialBills[0] }];
        // corruptBills[0].date = "2004=04-04";
        // console.log(corruptBills);
        // const test = () => {
        //   return [...initialBills, corruptBills];
        // };
        // console.log([...initialBills, corruptBills]);
        // console.log(Bills);
        // jest.spyOn(Bills);
        // console.log(test());
        // expect(() => test()).toThrow();
        // expect(
        //   mockedStore.bills.mockImplementationOnce(() => {
        //     return Promise.resolve([...initialBills, corruptBills]);
        //   })
        // ).toThrow();
        // .catch(e => expect(e).toMatch("error"));
        // try {
        //   await mockedStore.bills().list();
        // } catch (e) {console.log(e);
        //   expect(e).toMatch('error');
        // }
      });
    });

    //TODO 6
    describe("When I click on New Bill Button", () => {
      test("Then I should be sent on New Bill form", () => {
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

        const buttonNewBill = screen.getByRole("button", {
          name: /nouvelle note de frais/i,
        });
        expect(buttonNewBill).toBeTruthy(); //TODO nécessaire?
        const handleClickNewBill = jest.fn(e => bills.handleClickNewBill(e));
        buttonNewBill.addEventListener("click", handleClickNewBill);
        userEvent.click(buttonNewBill);
        expect(handleClickNewBill).toHaveBeenCalled();
      });
    });

    describe("When I click on one eye icon", () => {
      test.only("Then a modal should open", async () => {
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

        const billsPage = new Bills({
          document,
          onNavigate,
          store: mockedStore,
          localStorage: window.localStorage,
        });

        document.body.innerHTML = BillsUI({ data: bills });

        const iconEyes = screen.getAllByTestId("icon-eye");

        const handleClickIconEye = jest.fn(billsPage.handleClickIconEye);

        const modale = document.getElementById("modaleFile");

        $.fn.modal = jest.fn(() => modale.classList.add("show")); //mock de la modale Bootstrap

        if (iconEyes.length !== 0) {
          iconEyes.forEach(iconEye => {
            iconEye.addEventListener("click", () =>
              handleClickIconEye(iconEye)
            );
            userEvent.click(iconEye);

            expect(handleClickIconEye).toHaveBeenCalled();

            expect(modale).toBeVisible();

            // expect(
            //   await waitFor(() =>
            //     screen.findByRole("img", { name: /bill/i, hidden: true })
            //   )
            // ).toBeVisible();

            expect(modale).toHaveClass("show");
            expect(modale).toBeTruthy();
          });
        }
      });
    });

    // test d'intégration GET
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockedStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("fetches bills from mock API GET", async () => {
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.Bills);
        await waitFor(() => screen.getByText("Mes notes de frais"));
        const newBillBtn = await screen.findByRole("button", {
          name: /nouvelle note de frais/i,
        });
        expect(newBillBtn).toBeTruthy();
        const billsTable = document.querySelector("#example");
        expect(billsTable).toBeTruthy();
        // const billsTableRows = screen.getByTestId("tbody"); //FIXME plusieurs tbody trouvés?
        expect(within(billsTable).queryAllByRole("row")).toHaveLength(5);
      });

      test("fetches bills from an API and fails with 404 message error", async () => {
        mockedStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockedStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
