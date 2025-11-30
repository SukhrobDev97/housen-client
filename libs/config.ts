export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['projectCollaboration', 'projectPublic'];

const thisYear = new Date().getFullYear();

export const projectYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	projectYears.push(String(i));
}


export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topProjectRank = 2;
