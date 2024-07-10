"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

interface IFormState {
  name: string;
  email: string;
  phone?: string;
  address_1: string;
  address_2?: string;
  city: string;
  country: string;
  games: string[];
}

export function ApplyForVendorClientComponents() {
  const [form, setForm] = useState<IFormState>({
    name: "",
    email: "",
    phone: "",
    address_1: "",
    address_2: "",
    city: "",
    country: "",
    games: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-4">
        Apply for Vendorship!
      </h1>

      <form
        className="w-full mx-auto my-6 max-w-screen-sm flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          label="Vendor (account) Name"
          name="name"
          onChange={handleChange}
          isRequired
          labelPlacement="inside"
        />

        <Input
          label="Vendor (account) Email Address"
          name="email"
          onChange={handleChange}
          isRequired
          labelPlacement="inside"
        />

        <Input
          label="Vendor (account) Phone Number"
          name="phone"
          onChange={handleChange}
          labelPlacement="inside"
        />

        <Input
          label="Address Line 1"
          name="address_1"
          onChange={handleChange}
          isRequired
          labelPlacement="inside"
        />

        <Input
          label="Address Line 2"
          name="address_2"
          onChange={handleChange}
          labelPlacement="inside"
        />

        <Input
          label="City"
          name="city"
          onChange={handleChange}
          isRequired
          labelPlacement="inside"
        />

        <Input
          label="Country"
          name="country"
          onChange={handleChange}
          isRequired
          labelPlacement="inside"
        />

        <Select
          labelPlacement="inside"
          selectionMode="multiple"
          label="Choose your available sports"
          name="games"
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              games: e.target.value
                .split(",")
                .map((t) => t.trim().toLowerCase()),
            }));
          }}
          isRequired
        >
          <SelectItem textValue="Football" key={"Football"}>
            Football
          </SelectItem>
          <SelectItem textValue="Cricket" key={"Cricket"}>
            Cricket
          </SelectItem>
          <SelectItem textValue="Tennis" key={"Tennis"}>
            Tennis
          </SelectItem>
          <SelectItem textValue="Basketball" key={"Basketball"}>
            Basketball
          </SelectItem>
          <SelectItem textValue="Volleyball" key={"Volleyball"}>
            Volleyball
          </SelectItem>
          <SelectItem textValue="Baseball" key={"Baseball"}>
            Baseball
          </SelectItem>
          <SelectItem textValue="Golf" key={"Golf"}>
            Golf
          </SelectItem>
        </Select>

        <Button type="submit" color="primary">
          Apply
        </Button>
      </form>
    </div>
  );
}
