import { IContainerService } from 'interfaces/IContainerService';
import { injectable } from 'inversify';

@injectable()
export class ContainerService implements IContainerService {
  isCloud(): boolean {
    return process.env.SNOWFLAKE_CLOUD ? true : false;
  }
}
