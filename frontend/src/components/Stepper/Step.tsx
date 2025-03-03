export default interface Step {
  name: string;
  subSteps?: Step[];
}
