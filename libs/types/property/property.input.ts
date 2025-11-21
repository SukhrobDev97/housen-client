import { Direction } from '../../enums/common.enum';
import { ProjectStatus, ProjectStyle, ProjectType } from '../../enums/property.enum';

export interface ProjetInput {
	projectType: ProjectType;
	projectStyle: ProjectStyle;
	
	projectTitle: string;
	projectDuration: number;
	propertyImages: string[];
	projectDesc?: string;
	projectCollaboration?: boolean;
	projectPublic?: boolean;
	memberId?: string;
}

interface PISearch {
	memberId?: string;
	projectStyleList?: ProjectStyle[];
	typeList?: ProjectType[];
	options?: string[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	text?: string;
}

export interface ProjectsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	projectStatus?: ProjectStatus;
}

export interface AgencyProjectsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	projectStatus?: ProjectStatus;
	projectStyleList?: ProjectStyle[];
}

export interface AllProjectsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
