import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useEffect, useState } from "react";

function Admin(props) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(1);
  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    const defaultValues = {};
    props.filters.forEach((filter) => {
      if (filter.default) {
        defaultValues[filter.key] = filter.default;
      }
    });
    setFilterValues((values) => ({ ...defaultValues, ...values }));
  }, [props]);

  const handleQuery = async (e) => {
    let response;

    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      response = await fetch(
        "http://localhost:3001" + props.getUrl(filterValues),
        {
          headers: {
            profile_id: profile,
            ...(props.headers || {}),
          },
          method: props.method,
          body: props.getBody(filterValues),
        }
      );
    } catch (err) {
      setError(true);
      setData(err.toString());
    }

    try {
      const json = await response.json();
      setData(json);
      setError(response.status !== 200);
    } catch (err) {
      if (response.status === 200) {
        setError(false);
        setData("Success");
      } else {
        setError(true);
        setData(response.statusText);
      }
    }

    setShow(true);
    setLoading(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <Card style={{ marginTop: 40 }}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            {props.title}
          </Typography>
          <form noValidate>
            <Grid container spacing={2}>
              <Grid item xs={6} md={4} lg={3}>
                <div>Profile ID</div>
                <TextField
                  type="number"
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                />
              </Grid>
              {props.filters.map((filter) => (
                <Grid item xs={6} md={4} lg={3} key={`filter-${filter.key}`}>
                  <div>{filter.label}</div>
                  <TextField
                    type={filter.type}
                    value={filterValues[filter.key] || filter.default || ""}
                    onChange={(e) =>
                      setFilterValues({
                        ...filterValues,
                        [filter.key]: e.target.value,
                      })
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </form>
        </CardContent>
        <CardActions>
          <Button color="primary" onClick={handleQuery}>
            Execute
          </Button>
        </CardActions>
      </Card>

      <Backdrop open={loading} style={{ zIndex: 100 }}>
        <CircularProgress color="secondary" />
      </Backdrop>

      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>{error ? "Error" : "Result"}</DialogTitle>
        <DialogContent>
          <pre>{data !== "" ? JSON.stringify(data, "", 2) : "SUCCESS"}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Admin;
