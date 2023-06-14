export class DataModels {
  user: UserDataModel;
  map: Map<string, DataModel> = new Map();
  customMap: Map<string, any> = new Map();
  setInMap<T extends DataModel>(key: string, model: T): T {
    this.map.set(key, model);
    return model;
  }
  setCustomInMap<T>(key: string, cls: T): T {
    this.customMap.set(key, cls);
    return cls;
  }
  constructor(private app: GallopTransformBackend) {
    this.user = this.setInMap('user', new UserDataModel(app));
    this.bapi = this.setInMap('bapi', new BapiDataModel(app));
    // this.object = this.setInMap('object',new ObjectDataModel(app));
    this.ruleBaseWiseTransformedData = this.setInMap(
      'ruleBaseWiseTransformedData',
      new RuleBaseWiseTransformedDataDataModel(app),
    );
    this.project = this.setInMap('project', new ProjectDataModel(app));
    this.role = this.setInMap('role', new RoleDataModel(app));
    this.notification = this.setInMap('notification', new NotificationDataModel(app));
    this.activity = this.setInMap('activity', new ActivityDataModel(app));
    this.transformationRule = this.setInMap(
      'transformationRule',
      new TransformationRuleDataModel(app),
    );
    this.ruleBase = this.setInMap('ruleBase', new RuleBaseDataModel(app));
    this.cycle = this.setInMap('cycle', new CycleDataModel(app));
    this.comment = this.setInMap('comment', new CommentDataModel(app));
    this.projectSchema = this.setInMap('projectSchema', new ProjectSchemaDataModel(app));
    this.extractionLogic = this.setInMap('extractionLogic', new ExtractionLogicDataModel(app));
    this.countryCode = this.setInMap('countryCode', new CountryCodeDataModel(app));
    this.workstream = this.setInMap('workstream', new WorkstreamDataModel(app));

    app.socketConnections.addSocketRoutes(new UserSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new BapiSocketRoutes(app));
    // app.socketConnections.addSocketRoutes(new ObjectSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new RuleBaseWiseTransformedDataSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new ProjectSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new TransformationRuleSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new RoleSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new NotificationSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new ActivitySocketRoutes(app));
    app.socketConnections.addSocketRoutes(new RuleBaseSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new CycleSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new CommentSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new ProjectSchemaSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new ExtractionLogicSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new CountryCodeSocketRoutes(app));
    app.socketConnections.addSocketRoutes(new WorkstreamSocketRoutes(app));

    this.userCustom = this.setCustomInMap('user', new UserCustom(app));
    this.bapiCustom = this.setCustomInMap('bapi', new BapiCustom(app));
    // this.objectCustom = this.setCustomInMap("bapi", new ObjectCustom(app));
    this.ruleBaseWiseTransformedDataCustom = this.setCustomInMap(
      'ruleBaseWiseTransformedData',
      new RuleBaseWiseTransformedDataCustom(app),
    );
    this.projectCustom = this.setCustomInMap('project', new ProjectCustom(app));
    this.transformationRuleCustom = this.setCustomInMap(
      'transformationRule',
      new TransformationRuleCustom(app),
    );
    this.roleCustom = this.setCustomInMap('role', new RoleCustom(app));
    this.notificationCustom = this.setCustomInMap('notification', new NotificationCustom(app));
    this.activityCustom = this.setCustomInMap('activity', new ActivityCustom(app));
    this.ruleBaseCustom = this.setCustomInMap('ruleBase', new RuleBaseCustom(app));
    this.commentCustom = this.setCustomInMap('comment', new CommentCustom(app));
    this.workstreamCustom = this.setCustomInMap('workstream', new WorkstreamCustom(app));
    this.projectSchemaCustom = this.setCustomInMap('projectSchema', new ProjectSchemaCustom(app));
    this.extractionLogicCustom = this.setCustomInMap(
      'extractionLogicCustom',
      new ExtractionLogicCustom(app),
    );
    (this.countryCodeCustom = this.setCustomInMap('countryCode', new CountryCodeCustom(app))),
      (this.analyticsCustom = this.setCustomInMap('analyticsCustom', new AnalyticsCustom(app)));
  }
}
