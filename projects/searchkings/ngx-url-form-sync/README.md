# URL Form Syncer

## Usage

### In your component class:

```
@Component({
  selector: 'component-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnDestroy, OnInit {
  public dateForm: FormGroup;
  private urlFormSync: UrlFormSyncer;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlFormSyncService: UrlFormSyncService
  ) {}

  ngOnInit() {
    /**
    *  Some form values you would like to keep in sync with the URL params
    **/
    this.dateForm = this.formBuilder.group({
      grouping: ['accounts'],
      date_range: ['last_30_days']
    });

    /**
    *  Create a new instance of UrlFormSyncer
    **/
    this.urlFormSync = this.urlFormSyncService.create(
      this.dateForm,
      this.activatedRoute,
      this.onDestroy$
    );

    /**
    *  Use formValues$ observable to listen for changes and
    *  perform some arbitrary action
    **/
    this.urlFormSync.formValues$
      .pipe(untilDestroyed(this))
      .subscribe(values => {
        // Perform some action (e.g. an http request) with the new values
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
```

# API

## UrlFormSyncService

### `create(formGroup: FormGroup, activatedRoute: ActivatedRoute, destroySubject?: Subject\<any>)`

Create a new `UrlFormSyncer`.

#### Returns

- instance of `UrlFormSyncer`

| Parameter                     | Description                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **formGroup (required)**      | A form group to keep in-sync with any URL changes                                                                                                      |
| **activatedRoute (required)** | The injected instance of ActivatedRoute to listen for param changes on                                                                                 |
| **destroySubject (optional)** | A subject the UrlSyncer will listen to for when to stop syncing changes. Typically this is a subject you would emit to in your component's ngOnDestroy |

#### create(formGroup: FormGroup, activatedRoute: ActivatedRoute, destroySubject?: Subject\<any>): UrlFormSyncer

#### `destroy()`

Stop listening for any form / URL changes.
