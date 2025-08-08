import {
    IGetStudentInfoUseCase,
    IGetGradeInfoUseCase,
    IGetCoursesUseCase,
    IGetAcademicHistoryUseCase,
    IGetProgramInfoUseCase,
    IGetProgressInfoUseCase,
    IGetRequirementsInfoUseCase,
    IRegisterCourseUseCase,
    IDropCourseUseCase,
    IRequestTranscriptUseCase,
} from "../../../application/academics/useCases/AcademicUseCases";
import { IHttpRequest, IHttpResponse, HttpSuccess, HttpErrors } from "../IHttp";
import { IAcademicController } from "../IHttp"

export class AcademicController implements IAcademicController {
    private httpSuccess: HttpSuccess;
    private httpErrors: HttpErrors;

    constructor(
        private readonly getStudentInfoUseCase: IGetStudentInfoUseCase,
        private readonly getGradeInfoUseCase: IGetGradeInfoUseCase,
        private readonly getCoursesUseCase: IGetCoursesUseCase,
        private readonly getAcademicHistoryUseCase: IGetAcademicHistoryUseCase,
        private readonly getProgramInfoUseCase: IGetProgramInfoUseCase,
        private readonly getProgressInfoUseCase: IGetProgressInfoUseCase,
        private readonly getRequirementsInfoUseCase: IGetRequirementsInfoUseCase,
        private readonly registerCourseUseCase: IRegisterCourseUseCase,
        private readonly dropCourseUseCase: IDropCourseUseCase,
        private readonly requestTranscriptUseCase: IRequestTranscriptUseCase,
    ) {
        this.httpSuccess = new HttpSuccess();
        this.httpErrors = new HttpErrors();
    }

    async getStudentInfo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.user) {
            return this.httpErrors.error_401();
        }
        const result = await this.getStudentInfoUseCase.execute({ userId: httpRequest.user.userId });
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async getGradeInfo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.user) {
            return this.httpErrors.error_401();
        }
        const result = await this.getGradeInfoUseCase.execute({
            userId: httpRequest.user.userId,
        });
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async getCourses(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { search, page = 1, limit = 10 } = httpRequest.query;
        const defaultLimit = search ? Number(limit) : 5;
        const userId = httpRequest.user?.userId;
        const result = await this.getCoursesUseCase.execute({
            search: search as string,
            page: Number(page),
            limit: defaultLimit,
            userId
        });
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async getAcademicHistory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.user) {
            return this.httpErrors.error_401();
        }
        const { startTerm, endTerm } = httpRequest.query;
        const result = await this.getAcademicHistoryUseCase.execute({
            userId: httpRequest.user.userId,
            startTerm: startTerm ? String(startTerm) : undefined,
            endTerm: endTerm ? String(endTerm) : undefined,
        });
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async getProgramInfo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.user) {
            return this.httpErrors.error_401();
        }
        const result = await this.getProgramInfoUseCase.execute({ userId: httpRequest.user.userId });
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async getProgressInfo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.user) {
            return this.httpErrors.error_401();
        }
        const result = await this.getProgressInfoUseCase.execute({
            userId: httpRequest.user.userId,
        });
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async getRequirementsInfo(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.user) {
            return this.httpErrors.error_401();
        }
        const result = await this.getRequirementsInfoUseCase.execute({ userId: httpRequest.user.userId });
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async registerCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { courseId } = httpRequest.params;
        const { reason } = httpRequest.body;
        if (!httpRequest.user) {
            return this.httpErrors.error_401();
        }
        if (!courseId) {
            return this.httpErrors.error_400();
        }
        if (!reason) {
            return this.httpErrors.error_400();
        }
        const result = await this.registerCourseUseCase.execute({
            studentId: httpRequest.user.userId,
            courseId,
            reason,
        });
        if (!result.success) {
            const errorMsg = (result.data as { error: string }).error || "Failed to register course";
            return this.httpErrors.error_400(errorMsg);
        }
        return this.httpSuccess.success_200(result.data);
    }

    async dropCourse(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { courseId } = httpRequest.params;
        if (!httpRequest.user) {
            return this.httpErrors.error_401();
        }
        if (!courseId) {
            return this.httpErrors.error_400();
        }
        const result = await this.dropCourseUseCase.execute({
            studentId: httpRequest.user.userId,
            courseId,
        });
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }

    async requestTranscript(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const { deliveryMethod, address, email } = httpRequest.body;
        if (!httpRequest.user) {
            return this.httpErrors.error_401();
        }
        if (!deliveryMethod || !['electronic', 'mail'].includes(deliveryMethod)) {
            return this.httpErrors.error_400();
        }
        if (deliveryMethod === 'mail' && !address) {
            return this.httpErrors.error_400();
        }
        if (deliveryMethod === 'electronic' && !email) {
            return this.httpErrors.error_400();
        }
        const result = await this.requestTranscriptUseCase.execute({
            studentId: httpRequest.user.userId,
            deliveryMethod,
            address,
            email,
        });
        if (!result.success) {
            return this.httpErrors.error_400();
        }
        return this.httpSuccess.success_200(result.data);
    }
}