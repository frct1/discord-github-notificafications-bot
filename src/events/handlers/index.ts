import { ProjectCreatedEventHandler } from './ProjectCreated.handlers';
import { ProjectUpdatedEventHandler } from './ProjectUpdated.handlers';

export const PROJECT_EVENT_HANDLERS = [
  ProjectCreatedEventHandler,
  ProjectUpdatedEventHandler,
];
