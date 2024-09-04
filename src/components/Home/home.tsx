"use client";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import iconUp from "../icon/CaretDown.svg";

interface DataTableModel {
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  email: string;
  error: string;
}

interface HeadTableModel {
  key: string;
  label: string;
}

interface SortModel {
  sortKey: string;
  sortDirection: string;
}

export default function HomeComponent() {
  const [data, setData] = useState<DataTableModel[]>([
    {
      firstName: "Fenri",
      lastName: "Mintardja",
      position: "CEO",
      phone: "083899060680",
      email: "fenri_min@yahoo.com",
      error: "",
    },
    {
      firstName: "Meilisa",
      lastName: "Mintardja",
      position: "COO",
      phone: "083899060682",
      email: "meilisa_min@yahoo.com",
      error: "",
    },
  ]);

  const [temporaryData, setTemporaryData] = useState<DataTableModel[]>([]);
  const [currentAction, setCurrentAction] = useState("save");

  useEffect(() => {
    setTemporaryData(JSON.parse(JSON.stringify(data)));
  }, []);

  const headArray: HeadTableModel[] = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "position", label: "Position" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
  ];

  const [sort, setSort] = useState<SortModel>({
    sortKey: "First Name",
    sortDirection: "asc",
  });

  function handleHeaderClick(header: HeadTableModel) {
    setSort({
      sortKey: header.key,
      sortDirection:
        header.key == sort.sortKey
          ? sort.sortDirection === "asc"
            ? "desc"
            : "asc"
          : "desc",
    });
  }

  function sortedData(data: DataTableModel[]) {
    if (currentAction == "save" || currentAction == "revert") {
      return data.sort((a: any, b: any) => {
        if (sort.sortDirection === "asc") {
          return a[sort.sortKey] > b[sort.sortKey] ? 1 : -1;
        } else {
          return a[sort.sortKey] < b[sort.sortKey] ? 1 : -1;
        }
      });
    } else {
      return data;
    }
  }

  function addData() {
    if (currentAction != "add" && currentAction != "edit") {
      const newData: DataTableModel = {
        firstName: "",
        lastName: "",
        position: "",
        phone: "",
        email: "",
        error: "",
      };
      setData([newData, ...data]);
      setTemporaryData([newData, ...temporaryData]);
      setCurrentAction("add");
    }
  }

  function revert() {
    if (currentAction == "add") {
      setData(data.slice(1));
      setTemporaryData(temporaryData.slice(1));
      setCurrentAction("revert");
    } else if (currentAction == "edit") {
      setData(temporaryData);
      setCurrentAction("revert");
    }
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isDuplicateEmail(email: string, index: number): boolean {
    return data.some((item, idx) => item.email === email && idx !== index);
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    key: string
  ) {
    if (currentAction != "edit") {
      setTemporaryData(JSON.parse(JSON.stringify(data)));
    }
    const tempData = [...data];
    const value = e.target.value;
    if (key === "email") {
      if (!isValidEmail(value)) {
        tempData[index] = {
          ...tempData[index],
          ["error"]: "Invalid Email Format",
        };
      } else if (isDuplicateEmail(value, index)) {
        tempData[index] = {
          ...tempData[index],
          ["error"]: "Email Address is not Unique",
        };
      } else {
        tempData[index] = { ...tempData[index], ["error"]: "" };
      }
    }
    tempData[index] = { ...tempData[index], [key]: value };
    setData(tempData);
    setCurrentAction("edit");
  }

  function isEdited(index: number, key: keyof DataTableModel) {
    if (currentAction === "add" && index === 0) {
      return data[index][key] !== temporaryData[index]?.[key];
    } else if (currentAction === "edit") {
      return data[index][key] !== temporaryData[index]?.[key];
    }
    return false;
  }

  function saveData() {
    setCurrentAction("save");
    setTemporaryData(JSON.parse(JSON.stringify(data)));
  }

  return (
    <>
      <div className={styles.addIconContainer}>
        <img src="/icon/Add.svg" onClick={() => addData()}></img>
        <img src="/icon/Save.svg" onClick={() => saveData()}></img>
        <img src="/icon/Back.svg" onClick={() => revert()}></img>
      </div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tHead}>
            {headArray.map((list: HeadTableModel, index: any) => (
              <th key={index} onClick={() => handleHeaderClick(list)}>
                <div className={styles.tableHeaderContainer}>
                  <span>{list.label}</span>
                  <span>
                    {sort.sortKey == list.key ? (
                      <>
                        {sort.sortDirection == "asc" ? (
                          <img
                            src="/icon/Caret.svg"
                            className={styles.upIcon}
                          ></img>
                        ) : (
                          <img
                            src="/icon/Caret.svg"
                            className={styles.downIcon}
                          ></img>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tBody}>
          {sortedData(data).map((list: DataTableModel, index: any) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={list.firstName}
                  onChange={(e) => handleInputChange(e, index, "firstName")}
                  className={
                    isEdited(index, "firstName")
                      ? styles.editedInput
                      : styles.normalInput
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={list.lastName}
                  onChange={(e) => handleInputChange(e, index, "lastName")}
                  className={
                    isEdited(index, "lastName")
                      ? styles.editedInput
                      : styles.normalInput
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={list.position}
                  onChange={(e) => handleInputChange(e, index, "position")}
                  className={
                    isEdited(index, "position")
                      ? styles.editedInput
                      : styles.normalInput
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={list.phone}
                  onChange={(e) => handleInputChange(e, index, "phone")}
                  className={
                    isEdited(index, "phone")
                      ? styles.editedInput
                      : styles.normalInput
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={list.email}
                  onChange={(e) => handleInputChange(e, index, "email")}
                  className={
                    list.error !== ""
                      ? styles.errorInput
                      : isEdited(index, "email")
                      ? styles.editedInput
                      : styles.normalInput
                  }
                />
                {list.error != "" && (
                  <p className={styles.error}>{list.error}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
