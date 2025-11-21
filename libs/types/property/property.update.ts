import { ProjectStatus, ProjectStyle, ProjectType } from '../../enums/property.enum';

export interface ProjectUpdate {
	_id: string;
	projectType?: ProjectType;
	projectStatus?: ProjectStatus;
	projectStyle?: ProjectStyle;
	projectDuration?: string;
	projectTitle?: string;
	projectPrice?: number;
	projectImages?: string[];
	projectDesc?: string;
	projectCollaboration?: boolean;
	projectRent?: boolean;
	deletedAt?: Date;
	constructedAt?: Date;
}
