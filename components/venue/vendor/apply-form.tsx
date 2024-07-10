"use client";

import { Input, Select, SelectItem } from "@nextui-org/react";

export function ApplyForVendorClientComponents() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-4">
        Apply for Vendorship!
      </h1>

      <form className="w-full mx-auto my-6 max-w-screen-sm flex flex-col gap-4">
        <Input
          label="Vendor (account) Name"
          name="name"
          isRequired
          labelPlacement="inside"
        />

        <Input
          label="Vendor (account) Email Address"
          name="email"
          isRequired
          labelPlacement="inside"
        />

        <Input
          label="Vendor (account) Phone Number"
          name="phone"
          labelPlacement="inside"
        />

        <Input
          label="Address Line 1"
          name="address-1"
          isRequired
          labelPlacement="inside"
        />

        <Input
          label="Address Line 2"
          name="address-2"
          labelPlacement="inside"
        />

        <Input label="City" name="city" isRequired labelPlacement="inside" />

        <Input
          label="Country"
          name="country"
          isRequired
          labelPlacement="inside"
        />

        <Select
          labelPlacement="inside"
          selectionMode="multiple"
          label="Choose your available sports"
          name="games"
          isRequired
        >
          <SelectItem textValue="football" key={"sp-1"}>
            Football
          </SelectItem>
          <SelectItem textValue="basketball" key={"sp-2"}>
            Basketball
          </SelectItem>
          <SelectItem textValue="tennis" key={"sp-3"}>
            Tennis
          </SelectItem>
          <SelectItem textValue="volleyball" key={"sp-4"}>
            Volleyball
          </SelectItem>
          <SelectItem textValue="cricket" key={"sp-5"}>
            Cricket
          </SelectItem>
          <SelectItem textValue="baseball" key={"sp-6"}>
            Baseball
          </SelectItem>
          <SelectItem textValue="golf" key={"sp-7"}>
            Golf
          </SelectItem>
        </Select>
      </form>
    </div>
  );
}
