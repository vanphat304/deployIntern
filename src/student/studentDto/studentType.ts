enum Major {
  INFORMATION_SYSTEM = 'INFORMATION_SYSTEM',
  SOFTWARE_TECHNOLOGY = 'SOFTWARE_TECHNOLOGY',
  NETWORK_SCURITY = 'NETWORK_SCURITY',
  DATA_ANALYS = 'DATA_ANALYS',
}
export class Student {
  identifierStudent: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: string;
  class: string;
  majors: Major.INFORMATION_SYSTEM;
  email: string;
  phoneNumber: string;
  anotherContact: string;
  createdAt: Date;
  updateAt: Date;
}
