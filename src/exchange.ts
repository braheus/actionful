export abstract class ActionfulExchange<
    Request extends object,
    Response extends object,
> {
    // Phantom properties to maintain type information
    protected readonly _request!: Request;
    protected readonly _response!: Response;
}
