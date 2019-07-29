import faker from "faker";

describe("Apartments, Occupant, and ApartmentAssign", () => {
  const baseUrl = Cypress.env("baseUrl");

  const apartmentName = faker.company.companyName();
  const landlordName = faker.name.firstName();
  const address = faker.address.streetAddress();
  const accountNumber = faker.finance.account();
  const monthlyRent = faker.random.number();

  const name = faker.name.firstName();
  const employeeId = faker.random.uuid();

  const invalidNewApartment = {
    apartmentName,
    address,
    landlordName,
    accountNumber,
    leaseStart: "2019-07-01",
    leaseEnd: "2019-07-10",
    monthlyRent,
    capacity: -1,
    bedrooms: 1
  };

  const newApartment = {
    apartmentName,
    address,
    landlordName,
    accountNumber,
    leaseStart: "2019-07-01",
    leaseEnd: "2019-07-10",
    monthlyRent,
    capacity: 1,
    bedrooms: 1
  };

  const fillOutApartmentForm = ({
    apartmentName,
    address,
    landlordName,
    accountNumber,
    leaseStart,
    leaseEnd,
    monthlyRent,
    capacity,
    bedrooms
  }) => {
    cy.get("input[name=Name]").type(apartmentName);
    cy.get("input[name=Address]").type(address);
    cy.get("input[name=LandLordName]").type(landlordName);
    cy.get("input[name=LandLordAccount]").type(accountNumber);
    cy.get("input[name=LeaseStart]").type(leaseStart);
    cy.get("input[name=LeaseEnd]").type(leaseEnd);
    cy.get("input[name=Rent]").type(monthlyRent);
    cy.get("input[name=Capacity]").type(capacity);
    cy.get("input[name=Bedrooms]").type(bedrooms);
  };

  it("should create a new occupant and show occupant profile", () => {
    const status = "allocated";

    cy.visit(`${baseUrl}/newOccupant`);
    cy.get("h1").contains("Create New Occupant");
    cy.get("input[name=name]").type(name);
    cy.get("input[name=employeeId]").type(employeeId);
    cy.get("input[name=remarks]").type("testing");
    cy.get("input[name=country]").type("Singapore");
    cy.get("select[name=status]").select(status);
    cy.get("input[type=submit]").click();
    cy.get("a")
      .contains("OCCUPANTS")
      .click();
    cy.get("td")
      .contains(employeeId)
      .click();
    cy.get("h1").contains(name);
    cy.get("h2").contains("Employee ID");
    cy.get("p").contains(employeeId);
    cy.get("span").contains(status);
  });

  it("should be unable to create a new apartment and show apartment profile", () => {
    cy.visit(`${baseUrl}/newApartment`);
    cy.get("h1").contains("Create New Apartment");

    fillOutApartmentForm(invalidNewApartment);

    cy.get("input[type=submit]").click();
    cy.get("input[name=Capacity]").should("have.focus");
    cy.get("input[name=Name]").should("have.value", apartmentName);
    cy.get("a")
      .contains("APARTMENTS")
      .click();
    cy.contains(apartmentName).should("not.exist");
  });

  it("should create a new apartment and show apartment profile", () => {
    cy.visit(`${baseUrl}/newApartment`);
    cy.get("h1").contains("Create New Apartment");

    fillOutApartmentForm(newApartment);

    cy.get("input[type=submit]").click();
    cy.get("a")
      .contains("APARTMENTS")
      .click();
    cy.get("td")
      .contains(apartmentName)
      .click();
    cy.get("h1").contains(apartmentName);
    cy.get("h2").contains("Address");
    cy.get("p").contains(address);
  });

  it("be able to assign an occupant to apartment", () => {
    cy.visit(`${baseUrl}`);
    cy.contains(apartmentName).click();
    cy.get("button")
      .contains("+")
      .click();
    cy.get("input[id=occupantToAssign]").type(name);
    cy.contains("Select").click();
    cy.get("input[id=checkInDate]").type("2015-05-01");
    cy.get("input[id=checkOutDate]").type("2015-10-01");
    cy.get("button")
      .contains("Assign")
      .click();
    cy.contains(`Successfully assigned ${name} to ${apartmentName}`);
  });

  it("be able to cancel the assign operation", () => {
    cy.visit(`${baseUrl}`);
    cy.contains(apartmentName).click();
    cy.get("button")
      .contains("+")
      .click();
    cy.get("input[id=occupantToAssign]").type(name);
    cy.contains("Select").click();
    cy.get("input[id=checkInDate]").type("2016-05-01");
    cy.get("input[id=checkOutDate]").type("2016-10-01");
    cy.get("button")
      .contains("Cancel")
      .click();
    cy.get("input").should(
      "have.attr",
      "placeholder",
      "Search occupants here..."
    );
    cy.get("button[class=modalCloseButton]")
      .contains("X")
      .click();
    cy.contains("Occupant");
  });
});
