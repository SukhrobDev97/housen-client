import { ProjectStatus, ProjectStyle, ProjectType } from '../../enums/property.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Project {
	_id: string;
	projectType: ProjectType;
	projectStatus: ProjectStatus;
	projectStyle: ProjectStyle;
	projectTitle: string;
	projectPrice: number;
	projectDuration: number;
	projectViews: number;
	projectLikes: number;
	projectComments: number;
	projectRank: number;
	projectImages: string[];
	projectDesc?: string;
	projectCollaboration: boolean;
	projectPublic: boolean;
	memberId: string;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Projects {
	list: Project[];
	metaCounter: TotalCounter[];
}
