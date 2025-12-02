import React from "react";
import PersonInfo from "./PersonInfo";
import AddPerson from "./AddPerson";
import PersonDetails from "./PersonDetails";
import PersonList from "./PersonList";

const Setting = () => {
  return (
    <div>
      <AddPerson />
      <PersonInfo />
      <PersonDetails />
      <PersonList />
    </div>
  );
};

export default Setting;
